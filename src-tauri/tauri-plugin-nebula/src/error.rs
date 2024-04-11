use serde::{Serialize, Serializer};

#[derive(Debug, thiserror::Error)]
pub enum Error {
    #[error("[NebulaError]: Model already loaded: {0}")]
    ModelAlreadyLoaded(String),
    #[error("[NebulaError]: Model does not exist: {0}")]
    ModelNotLoaded(String),
    #[error("[NebulaError]: Context for model does not exist: {0}")]
    ModelContextNotExist(String),
    #[error("[NebulaError]: {0}")]
    Nebula(#[from] nebula::error::Error),
    #[error("[NebulaError]: Decode base 64 error {0}")]
    Base64(#[from] base64::DecodeError),
}

impl Serialize for Error {
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        serializer.serialize_str(self.to_string().as_ref())
    }
}

pub type Result<T> = std::result::Result<T, Error>;
