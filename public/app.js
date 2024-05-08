function App() {
	return {
		page: 1,
		courses: [],
		depts: [],
		dept: {},
		crs: {},
		async getCourses() {
			const courses = await fetch("/api/courses").then((res) => res.json());
			//console.log(response)
			this.courses = courses;
		},
		async getDepartment(dept_name) {
			console.log(dept_name);
			const dept = await fetch(`/api/department/${dept_name}`).then((res) => res.json());
			this.page = 2;
			this.dept = dept[0];
			console.log(dept[0]);
		},
		async Edit(id) {
			console.log(id);
			const recordsets = await fetch(`/api/courses/${id}`).then((res) => res.json());
			this.page = 3;
			this.crs = recordsets[0][0];
			this.depts = recordsets[1];
			console.log(recordsets[0]);
		},
		async Save() {
			fetch("/api/courses/save", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(this.crs),
			})
				.then((res) => res.json())
				.then((data) => {
					this.courses = data;
					this.page = 1;
				});
		},
	};
}
