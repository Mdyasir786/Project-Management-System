import React, { useState, useEffect } from "react"; 
import { useNavigate } from "react-router-dom";
import supabase from "./supabaseClient";
import JSZip from "jszip";
import "./UploadProject.css";

function UploadProject() {
  const navigate = useNavigate();
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [studentName, setStudentName] = useState("");
  const [department, setDepartment] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) {
        setError("Failed to fetch user. Please log in again.");
        navigate("/login");
        return;
      }
      setUserId(data.user.id);
    };
    fetchUser();
  }, [navigate]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
  };

  const handleUpload = async () => {
    if (!projectName.trim()) return setError("Project name is required.");
    if (!description.trim()) return setError("Project description is required.");
    if (!studentName.trim()) return setError("Student name is required.");
    if (!department.trim()) return setError("Department is required.");
    if (!rollNumber.trim()) return setError("Roll number is required.");
    if (files.length === 0) return setError("Please select at least one file.");

    setLoading(true);
    setError(null);

    try {
      const zip = new JSZip();

      files.forEach((file) => zip.file(file.name, file));

      const zipBlob = await zip.generateAsync({ type: "blob" });
      const fileExt = "zip";
      const fileName = `${Date.now()}.${fileExt}`;

      const MAX_FILE_SIZE = 5 * 1024 * 1024; 
      if (zipBlob.size > MAX_FILE_SIZE) {
        setError("The total file size exceeds the 5MB limit. Please upload smaller files.");
        return;
      }

      const { error: uploadError } = await supabase.storage
        .from("project")
        .upload(fileName, zipBlob, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) {
        console.error("Upload Error:", uploadError);
        setError("Failed to upload file to storage. Please try again.");
        return;
      }

      const { data: publicUrlData, error: publicUrlError } = supabase.storage
        .from("project")
        .getPublicUrl(fileName);

      if (publicUrlError || !publicUrlData) {
        console.error("Public URL Error:", publicUrlError);
        setError("Failed to retrieve the public URL for the uploaded file.");
        return;
      }

      const { error: insertError } = await supabase
        .from("projectmanagement")
        .insert([
          {
            project_name: projectName,
            description,
            student_name: studentName,
            department,
            roll_number: rollNumber,
            photo_url: publicUrlData.publicUrl,
            user_id: userId,
          },
        ]);

      if (insertError) {
        console.error("Insert Error:", insertError);
        setError("Failed to save project details. Please try again.");
        return;
      }

      alert("Project uploaded successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("General Error:", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-project-container">
      <h1>Upload Project</h1>
      {error && <p className="error-message">{error}</p>}
      <input
        type="text"
        placeholder="Project Name"
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
      />
      <textarea
        placeholder="Project Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        type="text"
        placeholder="Student Name"
        value={studentName}
        onChange={(e) => setStudentName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Department"
        value={department}
        onChange={(e) => setDepartment(e.target.value)}
      />
      <input
        type="text"
        placeholder="Roll Number"
        value={rollNumber}
        onChange={(e) => setRollNumber(e.target.value)}
      />
      <input
        type="file"
        multiple
        onChange={handleFileChange}
      />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Uploading..." : "Upload Project"}
      </button>
      <button onClick={() => navigate("/dashboard")} className="back-button">
        Back to Dashboard
      </button>
    </div>
  );
}

export default UploadProject;
