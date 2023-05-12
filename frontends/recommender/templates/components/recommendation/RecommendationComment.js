import React from "react";
import { InputText } from "../form/InputText";
import { InputTextarea } from "../form/InputTextarea";
import { RatingComponent } from "../form/RatingComponent";


export default function RecommendationComment({ control }) {
  return (
    <div className="withBorder comments">
      <span>User's review: <RatingComponent name={"rating"} label={"Rating"} control={control} /></span>
      <div>
        <InputText name={"commentingUser"} control={control} label={"User"} />
        <InputTextarea name={"comment"} control={control} label={"Comment"} />
      </div>
    </div>
  );
}
