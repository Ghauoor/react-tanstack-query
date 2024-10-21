export const fetchPosts = async () => {
  const postsRes = await fetch("http://localhost:3000/posts");
  const response = await postsRes.json();
  return response;
};

export const fetchTags = async () => {
  const tagsRes = await fetch("http://localhost:3000/tags");
  const response = await tagsRes.json();
  return response;
};

export const addPost = async (post) => {
  const addPost = await fetch("http://localhost:3000/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(post),
  });
  const response = await addPost.json();
  return response;
};
