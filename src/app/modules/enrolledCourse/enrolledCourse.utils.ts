export const generateGradeAndGradePoints = (totalNum: number) => {
  let grade = 'NA';
  let gradePoints = 0;

  if (totalNum >= 80) {
    grade = 'A+';
    gradePoints = 4.0;
  } else if (totalNum >= 70) {
    grade = 'A';
    gradePoints = 3.5;
  } else if (totalNum >= 60) {
    grade = 'B';
    gradePoints = 3.0;
  } else if (totalNum >= 50) {
    grade = 'C';
    gradePoints = 2.0;
  } else if (totalNum >= 40) {
    grade = 'D';
    gradePoints = 1.0;
  } else {
    grade = 'F';
    gradePoints = 0.0;
  }

  return { grade, gradePoints };
};
