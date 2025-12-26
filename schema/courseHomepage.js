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
    }
  }
`;
