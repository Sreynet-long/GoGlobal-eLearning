import {gql} from "@apollo/client";

export const GET_COURSE_WITH_PAGINATION = gql`
query GetCourseWithPagination($page: Int, $limit: Int, $keyword: String, $pagination: Boolean, $categoryId: String) {
  getCourseWithPagination(page: $page, limit: $limit, keyword: $keyword, pagination: $pagination, category_id: $categoryId) {
    data {
      _id
      category_id {
        _id
        category_name
        createdAt
        icon_src
        updatedAt
      }
      original_price
      sell_price
      title
      thumbnail
      course_includes {
        _id
        has_certificate_of_completion
        is_full_lifetime_access
        number_of_downloadable_resources
        number_of_hours
        number_of_lessons
        number_of_projects_practices
        number_of_video
        number_quizzes
        period_of_access_as_month
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