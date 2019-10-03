const filterCourse = function (data: any, input: any) {
    var filterData = {} as any;
    if (input["courses.country"]) {
        filterData.country = input["courses.country"];
    }
    if (input["courses.level"]) {
        filterData.level = input["courses.level"];
    }
    if (input["courses.grade"]) {
        filterData.grade = input["courses.grade"];
    }
    if (input["courses.subject"]) {
        filterData.subject = input["courses.subject"];
    }
    return data.map((value) => {
        value._source.courses = value._source.courses.filter((course) => {
            var result = true;
            for (var property in filterData) {
                if (course[property] !== filterData[property]) {
                    result = false;
                }
            }
            return result;
        });
        return value;
    });
};

const randomInsideArray = function(array: any) {
  return array[Math.floor(Math.random() * array.length)];
};

export default {
  filterCourse,
  randomInsideArray
};
