import { gql } from "@apollo/client";

export const MOBILE_LOGIN = gql`
  mutation MobileLogin($email: String!, $password: String!) {
    mobileLogin(email: $email, password: $password) {
      data {
        user {
          _id
          first_name
          last_name
          phone_number
          email
          gender
          profile_image
          role
        }
        token
      }
      status
      message {
        messageKh
        messageEn
      }
    }
  }
`;

export const MOBILE_REGISTER_ACCOUNT = gql`
  mutation MobileRegisterAccount($input: MobileRegisterAccountInput) {
    mobileRegisterAccount(input: $input) {
      data {
        user {
          _id
          first_name
          last_name
          phone_number
          email
          gender
          profile_image
          role
        }
        token
      }
      status
      message {
        messageKh
        messageEn
      }
    }
  }
`;

export const MOBILE_UPDATE_USER = gql`
  mutation MobileUpdateUser($id: ID!, $input: MobileUserUpdateInput) {
    mobileUpdateUser(_id: $id, input: $input) {
      status
      message {
        messageKh
        messageEn
      }
    }
  }
`;
export const GET_USER_BY_ID = gql`
  query GetUserById {
    getUserById {
      _id
      first_name
      last_name
      phone_number
      email
      gender
      profile_image
      is_enabled
      role
      remark
      createdAt
      updatedAt
    }
  }
`;
