import { createContext, FC, useContext, useState, useCallback } from 'react'
import { ApiError } from 'api/types'
import { Project } from 'domainTypes'
import api from 'api/httpClient'
import { useQuery, useQueryClient } from 'react-query'
import { useAuth } from './auth/AuthProvider'
import useLocalStorage from 'utils/useLocalStorage'

interface IProjectsContextValue {
  projects: Project[]
  isLoading: boolean
  error: ApiError | null
  selectedProject?: Project
  addProject: (newProject: Project) => void
  updateProject: (project: Project) => void
  setSelectedProject: (project: Project) => void
}

const ProjectsContext = createContext<IProjectsContextValue>(null!)
export const useProjects = () => useContext(ProjectsContext)

const ProjectsProvider: FC = ({ children }) => {
  const { isLoggedIn } = useAuth()
  const queryClient = useQueryClient()
  const [selectedProject, setSelectedProject] = useLocalStorage<Project | undefined>(
    'myscrum.selectedProject',
    undefined
  )

  const { data, isLoading, isIdle, error } = useQuery<Project[], ApiError>(
    ['projects'],
    async () => (await api.get('/projects')).data,
    {
      enabled: isLoggedIn,
      staleTime: Number.POSITIVE_INFINITY,
      cacheTime: Number.POSITIVE_INFINITY
    }
  )
  const addProject = useCallback(
    (project: Project) =>
      queryClient.setQueryData<Project[]>(['projects'], prev => [project, ...(prev || [])]),
    [queryClient]
  )

  const updateProject = useCallback(
    (project: Project) =>
      queryClient.setQueryData<Project[]>(['projects'], prev =>
        prev ? prev.map(x => (x.id === project.id ? project : x)) : []
      ),
    [queryClient]
  )

  const value: IProjectsContextValue = {
    projects: data || [],
    isLoading: isLoading || isIdle,
    error,
    selectedProject,
    addProject,
    updateProject,
    setSelectedProject
  }

  return <ProjectsContext.Provider value={value}>{children}</ProjectsContext.Provider>
}

export default ProjectsProvider
