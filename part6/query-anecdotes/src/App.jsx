import React from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import AnecdoteForm from "./components/AnecdoteForm";
import Notification from "./components/Notification";
import { getAnecdotes, updateAnecdote } from "./requests";
import { NotificationProvider, useNotification } from "./NotificationContext";

const App = () => {
  return (
    <NotificationProvider>
      <Main />
    </NotificationProvider>
  );
};

const Main = () => {
  const queryClient = useQueryClient();
  const { dispatch } = useNotification();

  const handleVote = useMutation(updateAnecdote, {
    onSuccess: () => {
      queryClient.invalidateQueries("anecdotes");
      dispatch(setNotification("Vote was successful!", "info", 5000));
    },
    onError: () => {
      dispatch(setNotification("Voting failed!", "error", 5000));
    },
  });

  const {
    data: anecdotes,
    error,
    isLoading,
  } = useQuery("anecdotes", getAnecdotes);

  if (isLoading) return <div>Loading...</div>;
  if (error)
    return <div>Anecdote service not available due to server problems</div>;

  return (
    <div>
      <h3>Anecdote app</h3>
      <Notification />
      <AnecdoteForm />
      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button
              onClick={() =>
                handleVote.mutate({ ...anecdote, votes: anecdote.votes + 1 })
              }
            >
              vote
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default App;
