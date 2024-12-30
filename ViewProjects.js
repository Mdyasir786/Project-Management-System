import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "./supabaseClient";
import "./ViewProjects.css";

function ViewProjects() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase.from("projectmanagement").select("*");
      if (error) {
        setError("Failed to fetch projects.");
      } else {
        setProjects(data);
      }
    };
    fetchProjects();
  }, []);

  const filteredProjects = projects.filter((project) =>
    project.project_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (projectId) => {
    const { error } = await supabase.from("projectmanagement").delete().eq("id", projectId);
    if (error) {
      setError("Failed to delete project.");
    } else {
      setProjects(projects.filter((project) => project.id !== projectId));
    }
  };

  return (
    <div className="view-projects-container">
      {error && <p className="error-message">{error}</p>}
      <input
        type="text"
        placeholder="Search for a project"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {filteredProjects.length > 0 ? (
        filteredProjects.map((project) => (
          <div key={project.id} className="project-card">
            <h2>{project.project_name}</h2>
            <p><strong>Description:</strong> {project.description}</p>
            <p><strong>Student Name:</strong> {project.student_name}</p>
            <p><strong>Department:</strong> {project.department}</p>
            <p><strong>Roll Number:</strong> {project.roll_number}</p>
            <div className="buttons-container">
              <a href={project.photo_url} download className="download-button">Download Project</a>
              <button onClick={() => handleDelete(project.id)} className="delete-button">Delete Project</button>
            </div>
          </div>
        ))
      ) : (
        <p>No projects found.</p>
      )}
      <button onClick={() => navigate("/dashboard")} className="back-button">
        Back to Dashboard
      </button>
    </div>
  );
}

export default ViewProjects;
