import { useParams } from 'react-router-dom'

const WorkItemDetail = () => {
  const { id } = useParams()
  return <div>WorkItemDetail works {id}</div>
}

export default WorkItemDetail
