import {gql} from '@apollo/client';

export const GET_COURSE_CATEGORY = gql`
query GetCourseCategoryWithPagination($page: Int, $limit: Int, $keyword: String, $pagination: Boolean) {
  getCourseCategoryWithPagination(page: $page, limit: $limit, keyword: $keyword, pagination: $pagination) {
    data {
      _id
      category_name
      icon_src
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