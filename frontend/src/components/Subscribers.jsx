import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUsers, FaVideo, FaPlay } from "react-icons/fa";
import { serverUrl } from "../App.jsx";

function Subscribers() {
    const [subscribers, setSubscribers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchSubscribers = async () => {
            try {
                setLoading(true);
                setError("");

                const result = await axios.get(
                    serverUrl + "/api/user/getsubscribers",
                    {
                        withCredentials: true
                    }
                );

                setSubscribers(result.data?.subscribers || []);

            } catch (error) {
                console.error("Subscribers error:", error);

                setError(
                    error.response?.data?.message ||
                    "Failed to load subscribers"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchSubscribers();
    }, []);

    const formatDate = (date) => {
        if (!date) return "N/A";

        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh] text-gray-400">
                Loading subscribers...
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <p className="text-red-400">{error}</p>
            </div>
        );
    }

    return (
        <div className="w-full text-white min-h-screen p-4 sm:p-6">

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold">
                        Subscribers
                    </h1>

                    <p className="text-sm text-gray-400 mt-1">
                        View your channel subscribers and their watch activity
                    </p>
                </div>

                <div className="hidden sm:flex items-center gap-2 bg-[#272727] px-4 py-2 rounded-lg">
                    <FaUsers className="text-orange-500" />
                    <span className="font-semibold">
                        {subscribers.length}
                    </span>
                </div>
            </div>

            {/* Empty State */}
            {subscribers.length === 0 ? (
                <div className="border border-gray-700 rounded-xl bg-[#181818] min-h-75 flex flex-col items-center justify-center">
                    <FaUsers className="text-gray-600 text-5xl mb-4" />

                    <h2 className="text-lg font-semibold text-gray-300">
                        No Subscribers Yet
                    </h2>

                    <p className="text-sm text-gray-500 mt-2">
                        When users subscribe to your channel, they will appear here.
                    </p>
                </div>
            ) : (

                /* Desktop Table */
                <div className="border border-gray-700 rounded-xl overflow-hidden bg-[#181818]">

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-175">

                            <thead className="bg-[#222222] border-b border-gray-700">
                                <tr>
                                    <th className="text-left px-5 py-4 text-sm font-semibold text-gray-300">
                                        #
                                    </th>

                                    <th className="text-left px-5 py-4 text-sm font-semibold text-gray-300">
                                        Subscriber
                                    </th>

                                    <th className="text-center px-5 py-4 text-sm font-semibold text-gray-300">
                                        Videos Watched
                                    </th>

                                    <th className="text-center px-5 py-4 text-sm font-semibold text-gray-300">
                                        Shorts Watched
                                    </th>

                                    <th className="text-center px-5 py-4 text-sm font-semibold text-gray-300">
                                        Subscribed On
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {subscribers.map((subscriber, index) => (

                                    <tr
                                        key={subscriber._id}
                                        className="border-b border-gray-800 hover:bg-[#222222] transition"
                                    >

                                        {/* Number */}
                                        <td className="px-5 py-4 text-sm text-gray-500">
                                            {index + 1}
                                        </td>

                                        {/* Username */}
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">

                                                {subscriber.photoUrl ? (
                                                    <img
                                                        src={subscriber.photoUrl}
                                                        alt={subscriber.username}
                                                        className="w-10 h-10 rounded-full object-cover border border-gray-700"
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-full bg-[#303030] flex items-center justify-center">
                                                        <FaUsers className="text-gray-500" />
                                                    </div>
                                                )}

                                                <div>
                                                    <p className="font-medium text-white">
                                                        {subscriber.username || "Unknown User"}
                                                    </p>

                                                    <p className="text-xs text-gray-500">
                                                        Subscriber
                                                    </p>
                                                </div>

                                            </div>
                                        </td>

                                        {/* Videos */}
                                        <td className="px-5 py-4 text-center">
                                            <div className="inline-flex items-center gap-2">
                                                <FaVideo className="text-blue-400" />
                                                <span className="font-semibold">
                                                    {subscriber.videosWatched || 0}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Shorts */}
                                        <td className="px-5 py-4 text-center">
                                            <div className="inline-flex items-center gap-2">
                                                <FaPlay className="text-purple-400" />
                                                <span className="font-semibold">
                                                    {subscriber.shortsWatched || 0}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Date */}
                                        <td className="px-5 py-4 text-center text-sm text-gray-300">
                                            {formatDate(subscriber.subscribedAt)}
                                        </td>

                                    </tr>

                                ))}
                            </tbody>

                        </table>
                    </div>
                </div>
            )}

        </div>
    );
}

export default Subscribers;