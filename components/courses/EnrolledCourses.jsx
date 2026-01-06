import { useQuery } from "@apollo/client";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDebounce } from "../../app/hook/useDebounce";
import { IMAGE_BASE_URL } from "../../config/env";
import { useLanguage } from "../../context/LanguageContext";
import { t } from "../../lang";
import { GET_COURSE_ENROLLED_WITH_PAGINATION } from "../../schema/course";
import EmptyCourseEnroll from "./EmptyCourse";

const { width } = Dimensions.get("window");

const CourseCard = ({ item, language, onPress }) => {
  const progress = item.overall_completion_percentage ?? 0;

  // const getCourseActionLabel = () => {
  //   if (item.has_course_completed || progress === 100) return "Completed";
  //   if (progress > 0) return "Continue";
  //   return "Start course";
  // };
  const getCourseAction = () => {
    if (item.has_course_completed || progress === 100) 
      return { label: "Completed", type: "completed" };

    if (progress > 0) return { label: "Continue", type: "continue" };
      return { label: "Start course", type: "start" };
    
  };

  const actionLabel = getCourseAction();

  return (
    <TouchableOpacity activeOpacity={0.8} style={styles.card} onPress={onPress}>
      <Image
        source={{ uri: `${IMAGE_BASE_URL}/file/${item.thumbnail}` }}
        style={styles.cardImage}
      />

      <View style={styles.cardBody}>
        <Text style={styles.textTitle} numberOfLines={2}>
          {item.title}
        </Text>

        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressText}>{progress}%</Text>
        </View>

        <View style={styles.cardFooter}>
          <View style={styles.enrollBadge}>
            <Text
              style={[
                styles.continueText,
                actionLabel.type === "Completed" && styles.completedText,
              ]}
            >
              <Text
                style={[
                  actionLabel.type === "completed"
                    ? styles.completedText
                    : actionLabel.type === "continue"
                    ? styles.textContinue
                    : styles.textEnroll,
                ]}
              >
                {actionLabel.label}
              </Text>
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function EnrolledCourses({ searchText }) {
  const router = useRouter();
  const { language } = useLanguage();
  const [courses, setCourses] = useState([]);
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const debouncedSearch = useDebounce(searchText, 500);

  const { data, loading, error, fetchMore, refetch } = useQuery(
    GET_COURSE_ENROLLED_WITH_PAGINATION,
    {
      variables: {
        page: 1,
        limit: 10,
        pagination: true,
        keyword: debouncedSearch || "",
      },
      fetchPolicy: "cache-and-network",
      notifyOnNetworkStatusChange: true,
    }
  );

  useEffect(() => {
    setPage(1);
    setCourses([]);
    refetch({
      page: 1,
      limit: 50,
      pagination: true,
      keyword: debouncedSearch || "",
    });
  }, [debouncedSearch]);

  useEffect(() => {
    if (data?.getCourseEnrolledWithPagination?.data) {
      const newCourses = data.getCourseEnrolledWithPagination.data;
      setCourses((prev) =>
        page === 1 ? newCourses : [...prev, ...newCourses]
      );
    }
  }, [data]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setPage(1);
    await refetch({
      page: 1,
      limit: 50,
      pagination: true,
      keyword: debouncedSearch || "",
    });
    setRefreshing(false);
  }, [refetch, debouncedSearch]);

  const loadMore = () => {
    const hasNextPage =
      data?.getCourseEnrolledWithPagination?.paginator?.hasNextPage;
    if (loading || !hasNextPage) return;

    const nextPage = page + 1;
    fetchMore({
      variables: { page: nextPage, keyword: debouncedSearch || "" },
    });
    setPage(nextPage);
  };

  if (error)
    return (
      <View style={styles.center}>
        <Text>{t("error_loading", language)}</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      <FlatList
        data={courses}
        keyExtractor={(item) => item.course_id.toString()}
        renderItem={({ item }) => (
          <CourseCard
            item={item}
            language={language}
            onPress={() =>
              router.push({
                pathname: `/course/${item.course_id}`,
                params: { courseId: item.course_id, enrolledId: item._id },
              })
            }
          />
        )}
        ListHeaderComponent={
          <Text style={styles.textHeader}>
            {t("courses_enrolled_list", language)}
          </Text>
        }
        ListEmptyComponent={!loading ? <EmptyCourseEnroll /> : null}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#58589b"
          />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.3}
        ListFooterComponent={
          loading && page > 1 ? (
            <ActivityIndicator
              size="small"
              color="#58589b"
              style={{ margin: 20 }}
            />
          ) : (
            <View style={{ height: 40 }} />
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  listContent: { paddingHorizontal: 16, paddingTop: 16 },
  textHeader: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1a1a1a",
    marginBottom: 20,
  },
  card: {
    flexDirection: "row",
    marginBottom: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    overflow: "hidden",
  },
  cardImage: { width: width * 0.32, height: 110, backgroundColor: "#eee" },
  cardBody: { flex: 1, padding: 12, justifyContent: "space-between" },
  textTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#2d2d2d",
    lineHeight: 20,
  },
  progressSection: { marginTop: 10 },

  progressBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },

  progressBarBackground: {
    flex: 1,
    height: 8,
    backgroundColor: "#E0E0E0",
    borderRadius: 4,
    overflow: "hidden",
    marginRight: 8,
  },

  progressBarFill: {
    height: "100%",
    backgroundColor: "#22c55e",
    borderRadius: 4,
  },

  progressText: {
    fontSize: 14,
    color: "#22c55e",
    fontWeight: "700",
    minWidth: 40,
    textAlign: "right",
  },
  completedText: { color: "#2E7D32", fontWeight: "700", fontSize: 14 },
textEnroll: { color: "#3F51B5", fontWeight: "600", fontSize: 12 },
  textContinue: { color: "#8d8513ff", fontWeight: "600", fontSize: 12 },

  cardFooter: { marginTop: 8, alignItems: "flex-end" },
  enrollBadge: {
    backgroundColor: "#F0F2FF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  continueText: { fontSize: 12, fontWeight: "600", color: "#3F51B5" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
