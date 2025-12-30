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
import { useFocusEffect } from "@react-navigation/native";
import { IMAGE_BASE_URL } from "../../config/env";
import { useLanguage } from "../../context/LanguageContext";
import { t } from "../../lang";
import { GET_COURSE_ENROLLED_WITH_PAGINATION } from "../../schema/course";
import EmptyCourseEnroll from "./EmptyCourse";

const { width } = Dimensions.get("window");

const CourseCard = ({ item, language, onPress }) => {
  const progress = item.overall_completion_percentage ?? 0;

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

        <View style={styles.progressSection}>
          <View style={styles.progressInfo}>
            <Text style={styles.progressText}>
              {progress}% {t("completed", language)}
            </Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${progress}%` }]} />
          </View>
        </View>

        {/* <View style={styles.cardFooter}>
          <Text style={styles.continueText}>Continue learning →</Text>
        </View> */}
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

  const { data, loading, error, fetchMore, refetch } = useQuery(
    GET_COURSE_ENROLLED_WITH_PAGINATION,
    {
      variables: {
        page: 1,
        limit: 10,
        pagination: true,
        keyword: searchText?.trim() || "",
      },
      fetchPolicy: "cache-and-network",
      notifyOnNetworkStatusChange: true,
    }
  );
    useFocusEffect(
    useCallback(() => {
      refetch({ page: 1 });
    }, [refetch])
  );
  // Update courses whenever new data is fetched
  useEffect(() => {
    if (data?.getCourseEnrolledWithPagination?.data) {
      const newCourses = data.getCourseEnrolledWithPagination.data;
      setCourses(prev => page === 1 ? newCourses : [...courses, ...newCourses]);
    }
  }, [data, page]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setPage(1);
    await refetch({ page: 1 });
    setRefreshing(false);
  }, [refetch]);

  const loadMore = () => {
    const hasNextPage =
      data?.getCourseEnrolledWithPagination?.paginator?.hasNextPage;
    if (loading || !hasNextPage) return;

    const nextPage = page + 1;
    fetchMore({ variables: { page: nextPage } });
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
  progressInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  progressBarContainer: {
    width: "100%",
    height: 10,
    backgroundColor: "#E0E0E0",
    borderRadius: 5,
    marginVertical: 8,
    overflow: "hidden",
  },
  progressBar: { backgroundColor: "#3F51B5", height: 10, borderRadius: 5, transitionProperty: "width" },
  progressText: { fontSize: 14, fontWeight: "600", color: "#3F51B5" ,marginLeft: 100},
  cardFooter: { marginTop: 8, alignItems: "flex-end" },
  continueText: { fontSize: 12, fontWeight: "700", color: "#58589b" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
