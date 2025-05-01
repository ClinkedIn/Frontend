import React, { useEffect, useState } from 'react'
import HiringAd from '../HiringAd'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { BASE_URL } from "../../constants";

interface RelatedUser {
  _id: string
  firstName: string
  lastName: string
  profilePicture: string
  lastJobTitle: string
  commonConnectionsCount: number
  matchScore: number
}

const Network = () => {
  const router = useRouter()
  const [relatedUsers, setRelatedUsers] = useState<RelatedUser[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch related users
  useEffect(() => {
    const fetchRelatedUsers = async () => {
      try {
        console.log('Fetching related users...')
        const response = await fetch(`${BASE_URL}/user/connections/related-users`) 
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch related users')
        }

        console.log('Related users fetched:', data.relatedUsers)
        setRelatedUsers(data.relatedUsers)
      } catch (err: any) {
        console.error('Error fetching related users:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
console.log("seiff")

    fetchRelatedUsers()
  }, [])

  const handleViewProfile = (userId: string) => {
    router.push(`/profile/${userId}`)
  }

  return (
    <div className="flex p-6 space-x-6">
      {/* Left Sidebar */}
      <div className="w-1/4 bg-white shadow-md rounded-lg border border-gray-200 p-5">
        <h2 className="text-xl font-semibold mb-4">Manage my network</h2>
        <ul className="space-y-2">
          <li>
            <Link href="/network/connections" className="flex items-center text-sm hover:text-blue-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
              </svg>
              Connections <span className="ml-2 text-gray-500">(77)</span>
            </Link>
          </li>
          {/* Other links... */}
        </ul>
      </div>

      {/* Main Section */}
      <div className="w-3/4">
        {/* No pending invitations */}
        <div className="bg-white shadow-md rounded-lg border border-gray-200 p-5 mb-6">
          <p className="text-sm">No pending invitations</p>
          <button
            onClick={() => router.push('/network/invitations')}
            className="float-right px-3 py-1 text-sm text-blue-500 border border-blue-500 rounded hover:bg-blue-500 hover:text-white transition"
          >
            Manage
          </button>
        </div>

        {/* People You May Know */}
        <div className="bg-white shadow-md rounded-lg border border-gray-200 p-5 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">People you may know from Cairo University</h2>
            <button
              onClick={() => router.push('/network/people-you-may-know')}
              className="text-sm text-blue-500 hover:underline"
            >
              Show all
            </button>
          </div>

          <div className="overflow-x-auto whitespace-nowrap">
            <div className="flex space-x-4">
              {loading ? (
                <p>Loading...</p>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : (
                relatedUsers.map((user) => (
                  <div key={user._id} className="flex flex-col items-center space-y-2">
                    <img
                      src={user.profilePicture}
                      alt={`${user.firstName} ${user.lastName}`}
                      className="w-20 h-20 rounded-full object-cover cursor-pointer"
                      onClick={() => handleViewProfile(user._id)}
                    />
                    <div>
                      <span
                        className="font-medium text-sm cursor-pointer hover:underline"
                        onClick={() => handleViewProfile(user._id)}
                      >
                        {user.firstName} {user.lastName}
                      </span>
                      <span className="text-xs text-gray-500">{user.lastJobTitle}</span>
                      <span className="text-xs text-gray-400">
                        {user.commonConnectionsCount} mutual connections
                      </span>
                      <button
                        className="px-4 py-1 mt-2 text-sm text-white bg-blue-500 rounded hover:bg-blue-600 transition"
                      >
                        Connect
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Hiring Ad */}
        <HiringAd />
      </div>
    </div>
  )
}

export default Network