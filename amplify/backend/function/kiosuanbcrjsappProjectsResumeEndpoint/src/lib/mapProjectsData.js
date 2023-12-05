const mapProjectsData = async (projects) => {
    return projects.map((project) => {
        // 

        return {
            name: project.name,
            description: project.description
        }
    })
}


module.exports = { mapProjectsData };