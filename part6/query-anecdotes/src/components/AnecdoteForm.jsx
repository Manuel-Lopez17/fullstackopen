import React from "react";
import { useMutation, useQueryClient } from "react-query";
import { createAnecdote } from "../requests";
import { useNotification } from "../NotificationContext";

const AnecdoteForm = () => {
  const queryClient = useQueryClient();
  const { dispatch } = useNotification();

  const newAnecdoteMutation = useMutation(createAnecdote, {
    onSuccess: () => {
      queryClient.invalidateQueries("anecdotes");
      dispatch(setNotification("Anecdote created successfully!", "info", 5000));
    },
    onError: (error) => {
      dispatch(setNotification(error.response.data.error, "error", 5000));
    },
  });

  const onCreate = (event) => {
    event.preventDefault();
    const content = event.target.anecdote.value;
    event.target.anecdote.value = "";
    if (content.length >= 5) {
      newAnecdoteMutation.mutate({ content, votes: 0 });
    } else {
      dispatch(
        setNotification(
          "Anecdote content is too short, it should have at least 5 characters",
          "error",
          5000
        )
      );
    }
  };

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default AnecdoteForm;
