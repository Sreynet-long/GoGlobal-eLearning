import { gql } from "@apollo/client";

export const GET_COURSE_WITH_PAGINATION = gql`
  query GetCourseWithPagination(
    $page: Int
    $limit: Int
    $keyword: String
    $pagination: Boolean
    $categoryId: String
  ) {
    getCourseWithPagination(
      page: $page
      limit: $limit
      keyword: $keyword
      pagination: $pagination
      category_id: $categoryId
    ) {
      data {
        _id
        title
        thumbnail
        category_id {
          _id
          category_name
          icon_src
          createdAt
          updatedAt
        }
        is_free_course
        original_price
        sell_price
        what_you_learn
        who_this_course_is_for
        requirements
        description
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
        content_section {
          _id
          section_order
          section_title
          createdAt
          updatedAt
        }
        has_enrolled
        overall_completion_percentage
        has_course_complated
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

export const GET_COURSE_ENROLLED_WITH_PAGINATION = gql`
  query GetCourseEnrolledWithPagination(
    $page: Int
    $limit: Int
    $keyword: String
    $pagination: Boolean
  ) {
    getCourseEnrolledWithPagination(
      page: $page
      limit: $limit
      keyword: $keyword
      pagination: $pagination
    ) {
      data {
        course_id
        title
        thumbnail
        overall_completion_percentage
        has_course_complated
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
export const CREATE_COURSE_ENROLLED = gql`
  mutation CreateCourseEnrolled($input: CourseEnrolledInput) {
    createCourseEnrolled(input: $input) {
      status
      message {
        messageKh
        messageEn
      }
    }
  }
`;
export const GET_COURSE_BY_ID = gql`
query GetCourseById($courseId: ID!) {
  getCourseById(course_id: $courseId) {
    _id
    title
    thumbnail
    category_id {
      _id
      category_name
      icon_src
      createdAt
      updatedAt
    }
    is_free_course
    original_price
    sell_price
    what_you_learn
    who_this_course_is_for
    requirements
    description
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
    content_section {
      _id
      section_order
      section_title
      createdAt
      updatedAt
    }
    has_enrolled
    overall_completion_percentage
    has_course_complated
    enrolled_id
    createdAt
    updatedAt
  }
}
`;

export const GET_COURSE_PROCESS_WITH_PAGINATION = gql`
  query GetCourseProcessWithPagination(
    $page: Int
    $limit: Int
    $keyword: String
    $pagination: Boolean
  ) {
    getCourseProcessWithPagination(
      page: $page
      limit: $limit
      keyword: $keyword
      pagination: $pagination
    ) {
      data {
        _id
        title
        thumbnail
        category_id {
          _id
          category_name
          icon_src
          createdAt
          updatedAt
        }
        original_price
        sell_price
        course_includes {
          number_of_lessons
          number_of_video
          number_of_hours
          number_quizzes
          number_of_projects_practices
          number_of_downloadable_resources
          is_full_lifetime_access
          has_certificate_of_completion
          period_of_access_as_month
        }
        content_section {
          _id
          section_order
          section_title
          createdAt
          updatedAt
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

export const GET_CONTENT_SECTION_WITH_PAGINATION = gql`
  query GetContentSectionWithPagination(
    $courseId: ID!
    $page: Int
    $limit: Int
    $keyword: String
    $pagination: Boolean
  ) {
    getContentSectionWithPagination(
      course_id: $courseId
      page: $page
      limit: $limit
      keyword: $keyword
      pagination: $pagination
    ) {
      data {
        _id
        section_order
        section_title
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

export const VIDEO_PROCESS_STATUS = gql`
  mutation VideoProcessStatus($input: CourseProcessInput) {
    videoProcessStatus(input: $input) {
      status
      message {
        messageKh
        messageEn
      }
    }
  }
`;
export const GET_VIDEO_CONTENT_WITH_PAGINATION = gql`
  query GetVideoContentWithPagination(
    $contentSectionId: ID!
    $page: Int
    $limit: Int
    $keyword: String
    $pagination: Boolean
  ) {
    getVideoContentWithPagination(
      content_section_id: $contentSectionId
      page: $page
      limit: $limit
      keyword: $keyword
      pagination: $pagination
    ) {
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
      data {
        _id
        content_section_id {
          _id
          section_order
          section_title
          createdAt
          updatedAt
        }
        video_content_order
        video_content_name
        video_src
        resources
        createdAt
        updatedAt
      }
    }
  }
`;
