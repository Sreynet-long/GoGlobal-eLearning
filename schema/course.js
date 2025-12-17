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