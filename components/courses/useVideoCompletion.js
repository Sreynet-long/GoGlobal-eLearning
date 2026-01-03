import { useMutation, useQuery } from "@apollo/client/react";
import { useState, useEffect, useCallback } from "react";
import { VIDEO_PROCESS_STATUS, GET_COURSE_BY_ID } from "../../schema/course";

export function useVideoCompletion(enrolledId, backendCompleted = []) {
  const [completedVideoIds, setCompletedVideoIds] = useState([]);
  const [videoProcessStatus] = useMutation(VIDEO_PROCESS_STATUS);

  // sync backend → local once
  useEffect(() => {
    if (!backendCompleted?.length) return;
    setCompletedVideoIds((prev) =>
      [...new Set([...prev, ...backendCompleted])]
    );
  }, [backendCompleted]);

  const toggleVideoComplete = useCallback(
    
    async (videoId, completed) => {
      if (!enrolledId) return;

      // optimistic UI
      setCompletedVideoIds((prev) =>
        completed
          ? [...new Set([...prev, videoId])]
          : prev.filter((id) => id !== videoId)
      );

      try {
        await videoProcessStatus(
           console.log("Saving:", {
          enrolledId,videoId, completed
        }),
          {
          variables: {
            input: {
              enrolled_id: enrolledId,
              video_content_id: videoId,
              has_completed: completed,
            },
          },
          
        });
       
      } catch (e) {
        console.error("Toggle failed", e);
      }
    },
    [enrolledId],
   
  );

  return { completedVideoIds, toggleVideoComplete };
}
