import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
const CourseInclude = () => {
  return (
   <View style={styles.container}>
      <Text>Course Include</Text>
    </View>
  );
};

export default CourseInclude;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});