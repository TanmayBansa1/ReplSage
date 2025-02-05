import React from 'react'
import { api } from '~/trpc/react'
import {useLocalStorage} from 'usehooks-ts'
const useProject = () => {

    const { data: projects } = api.project.getProjects.useQuery()
    const [selectedProjectID, setSelectedProjectID] = useLocalStorage("replsage-selected-project", "")
    const project = projects?.find((project) => project.id === selectedProjectID)

    return React.useMemo(() => ({
        projects, 
        selectedProjectID, 
        setSelectedProjectID, 
        project
    }), [projects, selectedProjectID, project])
}

export default useProject