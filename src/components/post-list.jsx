import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { addPost, fetchPosts, fetchTags } from "../api/api";
import React from "react";

function PostList() {
  const queryClient = useQueryClient();
  const [page, setPage] = React.useState(1);
  const {
    data: postData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["posts", { page }],
    queryFn: () => fetchPosts(page),
    staleTime: 1000 * 60 * 5,
  });

  console.log(postData);
  const {
    mutate,
    isError: isPostError,
    isPending,
    error: postError,
    reset,
  } = useMutation({
    mutationKey: ["createPost"],
    mutationFn: addPost,
    onSuccess: (/* data, variable, context*/) => {
      queryClient.invalidateQueries(["posts"]);
    },
    // onError: (error, variables, context) => {},
    // onSettled: (data, error, variables, context) => {},
  });
  const { data: tagsData, isLoading: isTagsLoading } = useQuery({
    queryKey: ["tags"],
    queryFn: fetchTags,
    staleTime: Infinity, // never refetch
    // gcTime: 0,
    // refetchInterval: 0, // never refetch
  });

  const handleSumit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const title = formData.get("title");
    const tags = Array.from(formData.keys()).filter(
      (key) => formData.get(key) === "on"
    );
    if (!title || !tags) return;

    mutate({ id: postData?.data?.length + 1, title, tags });
    e.target.reset();
  };

  return (
    <div className="container">
      {isLoading && isPending && isTagsLoading && <div>Loading...</div>}
      {isError && postError && <div>Error: {error?.message}</div>}
      <form onSubmit={handleSumit}>
        {isPostError && <h5 onClick={reset}>Unable to Post</h5>}
        <input
          type="text"
          placeholder="Enter your post.."
          className="postbox"
          name="title"
        />
        <div className="tags">
          {tagsData?.map((tag) => {
            return (
              <div key={tag}>
                <input name={tag} id={tag} type="checkbox" />
                <label htmlFor={tag}>{tag}</label>
              </div>
            );
          })}
        </div>
        <button disabled={isPending}>
          {isPending ? "Posting..." : "Post"}
        </button>
      </form>
      {postData &&
        postData?.data?.map((post) => {
          return (
            <div key={post.id} className="post">
              <h2>{post.title}</h2>
              {post.tags.map((tag) => (
                <span key={tag.id}>{tag}</span>
              ))}
              <p key={post.id}>{post.body}</p>
            </div>
          );
        })}
      {/* Pagination */}
      <div className="pages">
        <button
          onClick={() => setPage((old) => Math.max(old - 1, 0))}
          disabled={!postData?.prev}
        >
          Previous Page
        </button>
        <span>{page}</span>
        <button
          onClick={() => {
            // if (!isPlaceholderData && postData?.next) {
            setPage((old) => old + 1);
            // }
          }}
          // Disable the Next Page button until we know a next page is available
          // disabled={isPlaceholderData || !postData?.next}
        >
          Next Page
        </button>
      </div>
    </div>
  );
}

export default PostList;
