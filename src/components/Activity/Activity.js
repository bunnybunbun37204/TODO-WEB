import React, { useState, useEffect, useCallback } from "react";
import apiClient from "../../api/client";
import { toast } from "react-hot-toast";
import "./Activity.css";

const Activity = () => {
  const [activities, setActivities] = useState([]);
  const [newActivity, setNewActivity] = useState({ content: "", date: "" });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editedContent, setEditedContent] = useState("");
  const [editedDate, setEditedDate] = useState("");

  const fetchActivities = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await apiClient.get("/activities");
      setActivities(data);
    } catch (error) {
      toast.error("Failed to load activities");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const handleAddActivity = async (e) => {
    e.preventDefault();
    if (!newActivity.content || !newActivity.date) return;

    setLoading(true);
    try {
      const { data } = await apiClient.post("/activities", newActivity);
      setActivities((prevActivities) => [...prevActivities, data]);
      setNewActivity({ content: "", date: "" });
      toast.success("Activity added");
    } catch (error) {
      toast.error("Failed to add activity");
    } finally {
      setLoading(false);
    }
  };

  const handleEditActivity = async (id) => {
    if (!editedContent || !editedDate) return;
    
    setLoading(true);
    try {
      const { data } = await apiClient.patch(`/activities/${id}`, {
        content: editedContent,
        date: editedDate,
      });
      setActivities((prevActivities) =>
        prevActivities.map((activity) =>
          activity.id === id ? { ...activity, ...data } : activity
        )
      );
      setEditingId(null);
      toast.success("Activity updated");
    } catch (error) {
      toast.error("Failed to update activity");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteActivity = async (id) => {
    setLoading(true);
    try {
      await apiClient.delete(`/activities/${id}`);
      setActivities((prevActivities) =>
        prevActivities.filter((activity) => activity.id !== id)
      );
      toast.success("Activity deleted");
    } catch (error) {
      toast.error("Failed to delete activity");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="activity-container">
      <h2>Activity List</h2>

      <form onSubmit={handleAddActivity} className="activity-form">
        <input
          type="text"
          placeholder="Activity Content"
          value={newActivity.content}
          onChange={(e) =>
            setNewActivity({ ...newActivity, content: e.target.value })
          }
          required
        />
        <input
          type="date"
          value={newActivity.date}
          onChange={(e) =>
            setNewActivity({ ...newActivity, date: e.target.value })
          }
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Activity"}
        </button>
      </form>

      <table className="activity-table">
        <thead>
          <tr>
            <th>Content</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {activities.map((activity) => (
            <tr key={activity.id}>
              <td>
                {editingId === activity.id ? (
                  <input
                    type="text"
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                  />
                ) : (
                  activity.content
                )}
              </td>
              <td>
                {editingId === activity.id ? (
                  <input
                    type="date"
                    value={editedDate}
                    onChange={(e) => setEditedDate(e.target.value)}
                  />
                ) : (
                  activity.date
                )}
              </td>
              <td>
                {editingId === activity.id ? (
                  <>
                    <button onClick={() => handleEditActivity(activity.id)}>
                      Submit
                    </button>
                    <button onClick={() => setEditingId(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setEditingId(activity.id);
                        setEditedContent(activity.content);
                        setEditedDate(activity.date);
                      }}
                    >
                      Edit
                    </button>
                    <button onClick={() => handleDeleteActivity(activity.id)}>
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Activity;