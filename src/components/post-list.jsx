import { useQuery } from "@tanstack/react-query";
import React from "react";
import { fetchPosts } from "../api/api";

function PostList() {
  const {
    data: postData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  });

  return (
    <div className="container">
      {isLoading && <div>Loading...</div>}
      {isError && <div>Error: {error?.message}</div>}
      {postData &&
        postData.map((post) => {
          return (
            <div key={post.id} className="post">
              <h2>{post.title}</h2>
              {post.tags.map((tag) => (
                <span key={tag.id}>{tag}</span>
              ))}
              <p key={post.id}>{post.body}</p>
              <hr />
            </div>
          );
        })}
    </div>
  );
}

export default PostList;
