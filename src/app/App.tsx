import { compose, useDatabase, withDatabase } from '@nozbe/watermelondb/react';
import { useEffect } from 'preact/hooks';
import { ChatPage } from '@/pages/chat';

// const Comment = ({ comment }: any) => (
//   <div>
//     <p>{comment.body}</p>
//   </div>
// );
//
// const enhance = withObservables(['comment'], ({ comment }) => ({
//   comment, // shortcut syntax for `comment: comment.observe()`
// }));
// const EnhancedComment = enhance(Comment);

function App() {
  const database = useDatabase();

  useEffect(() => {
    // function createPost(title: string, body: string) {
    //   return database.write(() =>
    //     database.get('posts').create((post) => {
    //       post.title = title;
    //       post.body = body;
    //     })
    //   );
    // }
    //
    // createPost('New post', 'Lorem ipsum...').then(console.log);

    setTimeout(async () => console.log(await database.get('posts').query().fetch()), 1000);
  }, [database]);

  /*   
    TODO: get required data and put it to app state
    API calls
  */

  return (
    <div className="app">
      {/* Layout here */}
      <ChatPage />
      {/* <EnhancedComment /> */}
    </div>
  );
}

export default compose(
  withDatabase
  // withObservables([], ({ database }) => ({
  //   blogs: database.get('blogs').query(),
  // }))
)(App);
