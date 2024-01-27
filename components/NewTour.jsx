"use client";
import React from "react";
import toast from "react-hot-toast";
import TourInfo from "@/components/TourInfo";
import { auth, useAuth } from "@clerk/nextjs";
import {
  useMutation,
  QueryClient,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createNewTour,
  getExistingTour,
  generateTourResponse,
  fetchUserTokensById,
  subtractTokens,
} from "@/utils/actions";

const NewTour = () => {
  const queryClient = useQueryClient();
  const { userId } = useAuth();
  const {
    mutate,
    isPending,
    data: tour,
  } = useMutation({
    mutationFn: async (destination) => {
      const existingTour = await getExistingTour(destination);
      if (existingTour) return existingTour;

      const currentTokens = await fetchUserTokensById(userId);
      if (currentTokens < 200) {
        toast.error("Token balance too low....");
        return;
      }

      const newTour = await generateTourResponse(destination);
      if (!newTour) {
        toast.error("No matching city found...");
        return null;
      }
      await createNewTour(newTour.tour);
      queryClient.invalidateQueries({ queryKey: ["tours"] });
      const newTokens = await subtractTokens(userId, newTour.tokens);
      toast.success(`${newTokens} tokens remaining...`);
      return newTour.tour;
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const destination = Object.fromEntries(formData.entries());
    mutate(destination);
  };

  if (isPending) {
    return <span className="loading loading-lg"></span>;
  }

  return (
    <React.Fragment>
      <form onSubmit={handleSubmit} className=" max-w-2xl">
        <h2 className="mb-4">Select your dream destination</h2>
        <div className="join w-full">
          <input
            type="text"
            className="join-item input input-bordered w-full"
            name="city"
            placeholder="city"
            required
          />
          <input
            type="text"
            className="join-item input input-bordered w-full"
            name="country"
            placeholder="country"
            required
          />
          <button type="submit" className="btn btn-primary join-item">
            generate tour
          </button>
        </div>
      </form>
      <div className="mt-16">{tour ? <TourInfo tour={tour} /> : null}</div>
    </React.Fragment>
  );
};

export default NewTour;
