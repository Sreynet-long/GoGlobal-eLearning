import {gql} from "@apollo/client";

export const GET_COURSE_WITH_PAGINATION = gql`
query GetCourseWithPagination($page: Int, $limit: Int, $keyword: String, $pagination: Boolean, $categoryId: String) {
  getCourseWithPagination(page: $page, limit: $limit, keyword: $keyword, pagination: $pagination, category_id: $categoryId) {
    data {
      _id
      category_id {
        _id
        category_name
        icon_src
        createdAt
        updatedAt
      }
      original_price
      sell_price
      thumbnail
      title
      updatedAt
      course_includes {
        _id
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