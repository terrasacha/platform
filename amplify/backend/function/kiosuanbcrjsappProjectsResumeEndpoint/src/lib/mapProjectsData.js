
const { mapProjectFillProgress } = require("./mapProjectFillProgress.js");

const mapProjectsData = async (projects) => {
    const mappedProjects = await Promise.all(projects.map(async (project) => {
        // Mapeo de condiciones para visualizacion en marketplace
        const progressData = await mapProjectFillProgress(project);
        return {
            name: project.name,
            description: project.description,
            ...progressData
        };
    }));

    return mappedProjects.flat();
}


module.exports = { mapProjectsData };