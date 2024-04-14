function dataD() {
    return {
        courses: [],
        async getCourses(){
            const response = (await axios.get('/api/courses')).data
            //console.log(response)
            this.courses = response; 
        },
        async getDepartment(dept_name){
            console.log(dept_name)
            const response = (await axios.get(`/api/department/${dept_name}`)).data
            console.log(response)
        }
    }
} 