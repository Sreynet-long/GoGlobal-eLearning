import { gql } from "@apollo/client";

export const GET_COURSE_BANNER_WITH_PAGINATION = gql`
  query GetCoverSliderPagination(
    $page: Int
    $limit: Int
    $keyword: String
    $pagination: Boolean
    $isPublic: Boolean
  ) {
    getCoverSliderPagination(
      page: $page
      limit: $limit
      keyword: $keyword
      pagination: $pagination
      is_public: $isPublic
    ) {
      data {
        _id
        order
        image
        title
        description
        is_public
        createdAt
        updatedAt
      }
      paginator {
        slNo
        prev
        next
        perPage
        totalPosts
        totalPages
        currentPage
        hasPrevPage
        hasNextPage
        totalDocs
      }
    }
  }
`;
export const GET_COURSE_TRENDING_WITH_PAGINATION = gql`
  query GetHilightCourse($limit: Int) {
    getHilightCourse(limit: $limit) {
      _id
      title
      thumbnail
      category_id {
        category_name
      }
      sell_price
      original_price
      course_includes {
        number_of_lessons
        number_of_video
        number_of_hours
        number_quizzes
        number_of_projects_practices
        number_of_downloadable_resources
        is_full_lifetime_access
        period_of_access_as_month
        has_certificate_of_completion
      }
      overall_completion_percentage
    }
  }
`;
export const GET_COURSE_FREE_WITH_PAGINATION = gql`
  query GetFreeCourse($limit: Int) {
    getFreeCourse(limit: $limit) {
      _id
      title
      thumbnail
      category_id {
        category_name
      }
      overall_completion_percentage
      is_free_course
      course_includes {
        number_of_lessons
        number_of_video
        number_of_hours
        number_quizzes
        number_of_projects_practices
        number_of_downloadable_resources
        is_full_lifetime_access
        period_of_access_as_month
        has_certificate_of_completion
      }
    }
  }
`;

export const RESUME_LESSON = gql`
  query GetHilightCourse {
    getResumeLearning {
      course_id
      title
      overall_completion_percentage
    }
  }
`;
