"use client";
import { getAllTours } from "@/utils/actions";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import ToursList from "./ToursList";

const ToursPage = () => {
  const [searchValue, setSearchValue] = useState("");
  const { data, isPending } = useQuery({
    queryKey: ["tours", searchValue],
    queryFn: () => getAllTours(searchValue),
  });
  return (
    <React.Fragment>
      <form className=" max-w-lg mb-12 pt-3">
        <div className="join w-full">
          <input
            type="text"
            placeholder="enter city or country here..."
            value={searchValue}
            className="input input-bordered join-item w-full"
            onChange={(e) => setSearchValue(e.target.value)}
            required
          />
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isPending}
            onClick={() => setSearchValue("")}>
            {isPending ? "please wait..." : "reset"}
          </button>
        </div>
      </form>
      {isPending ? (
        <span className="loading"></span>
      ) : (
        <ToursList data={data} />
      )}
    </React.Fragment>
  );
};

export default ToursPage;
