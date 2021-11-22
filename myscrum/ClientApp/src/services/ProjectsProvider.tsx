import { createContext, FC, useContext, useCallback, useEffect } from 'react'
import { ApiError } from 'api/types'
import { Project } from 'domainTypes'
import api from 'api/httpClient'
import { useQuery, useQueryClient } from 'react-query'
import { useAuth } from './auth/AuthProvider'
import useLocalStorage from 'utils/useLocalStorage'

interface IProjectsContextValue {
  projects: Project[]
  isLoading: boolean
  isFetching: boolean
  error: ApiError | null
  selectedProject?: Project
  addProject: (newProject: Project) => void
  updateProject: (project: Project) => void
  removeProject: (projectId: string) => void
  removeContributor: (projectId: string, userId: string) => void
  setSelectedProject: (project: Project) => void
  refetch: () => Promise<void>
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

  const { data, isLoading, isIdle, isFetching, error, refetch } = useQuery<Project[], ApiError>(
    ['projects'],
    async () => (await api.get('/projects')).data,
    {
      enabled: isLoggedIn,
      staleTime: Number.POSITIVE_INFINITY,
      cacheTime: Number.POSITIVE_INFINITY
    }
  )

  useEffect(() => {
    if (!data) return
    if (selectedProject) setSelectedProject(data.find(x => x.id === selectedProject.id))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  const addProject = useCallback(
    (project: Project) =>
      queryClient.setQueryData<Project[]>(['projects'], prev => [project, ...(prev || [])]),
    [queryClient]
  )

  const updateProject = useCallback(
    (project: Project) => {
      queryClient.setQueryData<Project[]>(['projects'], prev =>
        prev ? prev.map(x => (x.id === project.id ? project : x)) : []
      )
    },
    [queryClient]
  )

  const removeProject = useCallback(
    (projectId: string) => {
      queryClient.setQueryData<Project[]>(['projects'], prev =>
        prev ? prev.filter(x => x.id !== projectId) : []
      )
    },
    [queryClient]
  )

  const removeContributor = useCallback(
    (projectId: string, userId: string) => {
      queryClient.setQueryData<Project[]>(['projects'], prev =>
        prev
          ? prev.map(x =>
              x.id === projectId
                ? { ...x, contributors: x.contributors.filter(c => c.id !== userId) }
                : x
            )
          : []
      )
    },
    [queryClient]
  )

  const value: IProjectsContextValue = {
    projects: data || [],
    isLoading: isLoading || isIdle,
    isFetching,
    error,
    selectedProject,
    addProject,
    updateProject,
    removeProject,
    removeContributor,
    setSelectedProject,
    refetch: async () => {
      await refetch()
    }
  }

  return <ProjectsContext.Provider value={value}>{children}</ProjectsContext.Provider>
}

export default ProjectsProvider
