import { useMutation } from "@apollo/client/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { GET_COURSE_BY_ID, VIDEO_PROCESS_STATUS } from "../../schema/course";

export function useVideoCompletion(
  enrolledId,
  courseId,
  backendCompleted = [],
  refetch
) {
  const [completedVideoIds, setCompletedVideoIds] = useState([]);
  const [videoProcessStatus] = useMutation(VIDEO_PROCESS_STATUS,{
  });

  const syncedRef = useRef(false);

  // useEffect(() => {
  //   if (syncedRef.current) return;
  //   if (!backendCompleted?.length) return;

  //   setCompletedVideoIds([...new Set(backendCompleted)]);
  //   syncedRef.current = true;
  // }, [backendCompleted]);

  useEffect(() => {
    if (!backendCompleted) return;
    setCompletedVideoIds(backendCompleted);
  },[backendCompleted]);

  const toggleVideoComplete = useCallback(
    async (videoId, completed) => {
      if (!enrolledId) return;

      setCompletedVideoIds((prev) =>
        completed
          ? [...new Set([...prev, videoId])]
          : prev.filter((id) => id !== videoId)
      );

      try {
        console.log("saving:", {enrolled_id: enrolledId,
              video_content_id: videoId,
              has_completed: completed,});
        await videoProcessStatus({
          variables: {
            input: {
              enrolled_id: enrolledId,
              video_content_id: videoId,
              has_completed: completed,
            },
          },
          update: (cache) => {
            try {
              const existing = cache.readQuery({
                query: GET_COURSE_BY_ID,
                variables: { courseId },
              });

              if (!existing?.getCourseById) return;

              const prevCompleted = existing.getCourseById.completedVideo || [];

              const newCompleted = completed
                ? [...new Set([...prevCompleted, videoId])]
                : prevCompleted.filter((id) => id !== videoId);

              cache.writeQuery({
                query: GET_COURSE_BY_ID,
                variables: { courseId },
                data: {
                  getCourseById: {
                    ...existing.getCourseById,
                    completedVideo: newCompleted,
                  },
                },
              });
            } catch (err) {
              console.warn("Cache update failed:", err);
            }
          },
        });
      } catch (e) {
        console.error("Toggle failed", e);
        // setCompletedVideoIds((prev) =>
        //   completed ? prev.filter((id) => id !== videoId) : [...prev, videoId]
        // );

        setCompletedVideoIds((prev) =>
          completed
            ? prev.filter((id) => id !== videoId)
            : [...new Set([...prev, videoId])]
        );
      }
    },
    [enrolledId, courseId, videoProcessStatus]
  );

  return { completedVideoIds, toggleVideoComplete };
}
