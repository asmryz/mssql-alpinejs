function App() {
    return {
        page: 1,
        courses: [],
        dept: {},
        async getCourses() {
            const courses = await fetch('/api/courses').then(res => res.json())
            //console.log(response)
            this.courses = courses;
        },
        async getDepartment(dept_name) {
            console.log(dept_name)
            const dept = await fetch(`/api/department/${dept_name}`).then(res => res.json())
            this.page = 2
            this.dept = dept[0]
            console.log(dept[0])
        }
    }
} 