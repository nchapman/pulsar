use futures_util::TryStreamExt;
use log::info;
use serde::{ser::Serializer, Serialize};
use std::time::Duration;
use tauri::{
    command,
    plugin::{Builder as PluginBuilder, TauriPlugin},
    Runtime, Window,
};
use tokio::{
    fs::{File, OpenOptions},
    io::{AsyncWriteExt, BufWriter},
};
use tokio_util::codec::{BytesCodec, FramedRead};

use read_progress_stream::ReadProgressStream;

use std::{collections::HashMap, sync::Mutex};
use tokio::fs;

type Result<T> = std::result::Result<T, Error>;

#[derive(Debug, thiserror::Error)]
pub enum Error {
    #[error(transparent)]
    Io(#[from] std::io::Error),
    #[error(transparent)]
    Request(#[from] reqwest::Error),
    // #[error("{0}")]
    // ContentLength(String),
    #[error("request failed with status code {0}: {1}")]
    HttpErrorCode(u16, String),
}

impl Serialize for Error {
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        serializer.serialize_str(self.to_string().as_ref())
    }
}

#[derive(Clone, Serialize)]
struct ProgressPayload {
    id: u32,
    progress: u64,
    total: u64,
}

#[command]
async fn download<R: Runtime>(
    window: Window<R>,
    id: u32,
    url: &str,
    path: &str,
    headers: HashMap<String, String>,
) -> Result<u32> {
    let client = reqwest::Client::builder()
        .read_timeout(Duration::from_secs(30))
        .build()
        .unwrap();

    let mut current_size: Option<u64> = None;

    let file_path = std::path::Path::new(path);
    let file = if file_path.exists() {
        let metadata = fs::metadata(file_path).await?;

        current_size = Some(metadata.len());

        OpenOptions::new()
            .write(true)
            .append(true)
            .open(file_path)
            .await?
    } else {
        File::create(file_path).await?
    };

    info!("Doing initial request to get file size: {}", url);
    // Do an initial header request to get the file size
    let mut head_request = client.head(url);

    for (key, value) in headers.clone() {
        head_request = head_request.header(&key, value);
    }

    let mut total_size = 0;
    let head_response = head_request.send().await?;

    if head_response.status().is_success() {
        // Do not use header_response.content_length() because it calculates the body size
        // not the header value
        total_size = head_response
            .headers()
            .get(reqwest::header::CONTENT_LENGTH)
            .and_then(|value| value.to_str().ok())
            .and_then(|value| value.parse().ok())
            .unwrap_or(0);
    }

    let mut progress = 0.;
    let mut last_percent = 0;

    let mut request = client.get(url);

    for (key, value) in headers {
        request = request.header(&key, value);
    }

    info!(
        "File: {}, Total size: {}, Current size: {}",
        path,
        total_size,
        current_size.unwrap_or(0)
    );

    if let Some(size) = current_size {
        if size == total_size {
            info!("File {} has been fully downloaded, skipping...", path);
            return Ok(id);
        }

        if size < total_size {
            info!("File {} has been partially downloaded, resuming...", path);
            let range_header_value = format!("bytes={}-", size);
            request = request.header("Range", range_header_value);
        }
    }

    let response = request.send().await?;
    let total = response.content_length().unwrap_or(0);

    let mut file = BufWriter::new(file);
    let mut stream = response.bytes_stream();

    info!("Starting download for {}", url);
    loop {
        let next = stream.try_next().await;
        match next {
            Ok(chunk) => match chunk {
                Some(chunk) => {
                    file.write_all(&chunk).await?;

                    progress += chunk.len() as f64;
                    let current_percent = (progress / total as f64 * 100.0) as i32;
                    if current_percent > last_percent {
                        last_percent = current_percent;
                        let _ = window.emit(
                            "download://progress",
                            ProgressPayload {
                                id,
                                progress: progress as u64,
                                total,
                            },
                        );
                        info!("Download progress: {}%", last_percent);
                    }
                }
                // None signifies end of stream
                None => break,
            },
            // Stream error, due to timeout or disconnection
            Err(err) => {
                // Flush the file before returning the error JS
                // so that the file is not corrupted and can be resumed afterwards
                file.flush().await?;
                // If it fail because of timeout to JS this will appear as error deconding response body
                return Err(err.into());
            }
        }
    }

    // All bytes have been streamed, make sure file is flushed
    file.flush().await?;

    // Completes the promise
    Ok(id)
}

#[command]
async fn upload<R: Runtime>(
    window: Window<R>,
    id: u32,
    url: &str,
    file_path: &str,
    headers: HashMap<String, String>,
) -> Result<String> {
    // Read the file
    let file = File::open(file_path).await?;
    let file_len = file.metadata().await.unwrap().len();

    // Create the request and attach the file to the body
    let client = reqwest::Client::new();
    let mut request = client
        .post(url)
        .header(reqwest::header::CONTENT_LENGTH, file_len)
        .body(file_to_body(id, window, file));

    // Loop trought the headers keys and values
    // and add them to the request object.
    for (key, value) in headers {
        request = request.header(&key, value);
    }

    let response = request.send().await?;
    if response.status().is_success() {
        response.text().await.map_err(Into::into)
    } else {
        Err(Error::HttpErrorCode(
            response.status().as_u16(),
            response.text().await.unwrap_or_default(),
        ))
    }
}

fn file_to_body<R: Runtime>(id: u32, window: Window<R>, file: File) -> reqwest::Body {
    let stream = FramedRead::new(file, BytesCodec::new()).map_ok(|r| r.freeze());
    let window = Mutex::new(window);
    reqwest::Body::wrap_stream(ReadProgressStream::new(
        stream,
        Box::new(move |progress, total| {
            let _ = window.lock().unwrap().emit(
                "file_transfer://progress",
                ProgressPayload {
                    id,
                    progress,
                    total,
                },
            );
        }),
    ))
}

pub fn init_plugin<R: Runtime>() -> TauriPlugin<R> {
    PluginBuilder::new("file_transfer")
        .invoke_handler(tauri::generate_handler![download, upload])
        .build()
}