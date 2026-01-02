import { useMutation } from "@apollo/client/react";
import { useCallback, useState } from "react";
import { VIDEO_PROCESS_STATUS } from "../../schema/course";

export function useVideoCompletion(enrolledId) {
  const [completedVideoIds, setCompletedVideoIds] = useState([]);
  const [videoProcessStatus] = useMutation(VIDEO_PROCESS_STATUS);
  const markVideoComplete = useCallback(
    async (videoId) => {
      if (!enrolledId || !videoId) return;
      setCompletedVideoIds((prev) => [...new Set([...prev, videoId])]);

      try {
        await videoProcessStatus({
          variables: {
            input: {
              has_completed: true,
              enrolled_id: enrolledId,
              video_content_id: videoId,
            },
          },
          optimisticResponse: {
            videoProcessStatus: {
              __typename: "ResponseMessage",
              status: true,
              message: {
                __typename: "Message",
                messageEn: "Marked complete (optimistic)",
                messageKh: "បានបញ្ចប់ (optimistic)",
              },
            },
          },
          update: (cache, { data }) => {
            if (data?.videoProcessStatus?.status) {
              cache.modify({
                id: cache.identify({
                  __typename: "CourseEnrolled",
                  id: enrolledId,
                }),
                fields: {
                  overall_completion_percentage(existing = 0) {
                    return existing + 1;
                  },
                  completedVideo(existing = []) {
                    return [...new Set([...existing, videoId])];
                  },
                },
              });
            }
          },
        });
      } catch (err) {
        console.error("Video status failed", err);
      }
    },
    [videoProcessStatus, enrolledId]
  );

  return { completedVideoIds, markVideoComplete };
}
