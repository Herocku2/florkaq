import React from "react";
import { Heder } from "../../components/Heder";
import PublishWizard from "./PublishWizard";
import "./style.css";

export const Publish = () => {
  return (
    <div className="publish">
      <Heder className="heder-home" />
      <PublishWizard />
    </div>
  );
};
