import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import supabase from "./supabaseClient";
import "./ViewProject.css";

function ViewProject() {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const { data, error } = await supabase
          .from("projectmanagement")
          .select("*")
          .eq("id", projectId)
          .single();
        if (error) {
          setError("Failed to fetch project details.");
        } else {
          setProject(data);
        }
      } catch {
        setError("An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [projectId]);

  if (loading) {
    return <div className="loading">Loading project details...</div>;
  }

  return (
    <div className="view-project-container">
      {error && <p className="error-message">{error}</p>}
      {project ? (
        <div>
          <h1>{project.project_name}</h1>
          <p>Description: {project.description}</p>
          <p>Student Name: {project.student_name}</p>
          <img
            src={project.photo_url}
            alt={project.project_name || "Project Image"}
            className="project-image"
          />
          <a href={project.photo_url} download className="download-button">
            Download Project
          </a>
        </div>
      ) : (
        <p className="no-project">No project details available.</p>
      )}
      <button onClick={() => navigate("/view-projects")} className="back-button">
        Back to Projects
      </button>
    </div>
  );
}

export default ViewProject;
