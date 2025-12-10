import { useMemo, useState } from "react";
import { useSampleData } from "../service/useSampleData";
import RingBadge from "./ringBadge";

export default function CamerasTable() {
  const { data, setData } = useSampleData();

  // --- UI state ---
  const [query, setQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [selected, setSelected] = useState(new Set());

  // derived lists
  const locations = useMemo(() => {
    const s = new Set(data.map((s) => s.location));
    return ["", ...Array.from(s)];
  }, [data]);

  const statuses = useMemo(
    () => ["", ...Array.from(new Set(data.map((s) => s.status)))],
    [data]
  );

  // --- filtering & searching ---
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return data.filter((r) => {
      if (locationFilter && r.location !== locationFilter) return false;
      if (statusFilter && r.status !== statusFilter) return false;
      if (!q) return true;
      return (
        r.name.toLowerCase().includes(q) ||
        (r.name && r.name.toLowerCase().includes(q)) ||
        (r.location && r.location.toLowerCase().includes(q))
      );
    });
  }, [data, query, locationFilter, statusFilter]);

  const total = filtered.length;
  const pageCount = Math.max(1, Math.ceil(total / perPage));
  const start = (page - 1) * perPage;
  const pageItems = filtered.slice(start, start + perPage);

  // --- selection helpers ---
  const toggleRow = (id: any) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  const toggleAll = () => {
    const idsOnPage = pageItems.map((p) => p.id);
    const allSelected = idsOnPage.every((id) => selected.has(id));
    const next = new Set(selected);
    if (allSelected) {
      idsOnPage.forEach((id) => next.delete(id));
    } else {
      idsOnPage.forEach((id) => next.add(id));
    }
    setSelected(next);
  };

  // --- small inline heroicons (outline) ---
  const IconSearch = ({ className = "h-5 w-5" }) => (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 21l-4.35-4.35M9.5 17a7.5 7.5 0 100-15 7.5 7.5 0 000 15z"
      />
    </svg>
  );

  const IconChevronLeft = ({ className = "h-4 w-4" }) => (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 19l-7-7 7-7"
      />
    </svg>
  );

  const IconChevronRight = ({ className = "h-4 w-4" }) => (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 5l7 7-7 7"
      />
    </svg>
  );

  const IconDots = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      className="size-6"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636"
      />
    </svg>
  );

  const DeviceIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      className="size-6"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M10.5 19.5h3m-6.75 2.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-15a2.25 2.25 0 0 0-2.25-2.25H6.75A2.25 2.25 0 0 0 4.5 4.5v15a2.25 2.25 0 0 0 2.25 2.25Z"
      />
    </svg>
  );

  const CloudIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 15a4.5 4.5 0 0 0 4.5 4.5H18a3.75 3.75 0 0 0 1.332-7.257 3 3 0 0 0-3.758-3.848 5.25 5.25 0 0 0-10.233 2.33A4.502 4.502 0 0 0 2.25 15Z"
      />
    </svg>
  );

  // --- small helpers for pill colors ---
  const StatusPill = ({ status }: { status: string }) => {
    const base =
      "inline-flex items-center px-2 py-1 text-xs font-semibold rounded-md";
    if (status === "Active")
      return (
        <span className={`${base} bg-emerald-100 text-emerald-700`}>
          Active
        </span>
      );
    if (status === "Inactive")
      return (
        <span className={`${base} bg-gray-100 text-gray-700`}>Inactive</span>
      );
    return (
      <span className={`${base} bg-yellow-100 text-yellow-700`}>{status}</span>
    );
  };

  const CurrentStatus = ({ currentStatus }: { currentStatus: string }) => {
    if (currentStatus === "Online")
      return (
        <span
          className="inline-block h-3 w-3 rounded-full bg-emerald-500 mr-2"
          aria-hidden
        />
      );
    if (currentStatus === "Offline")
      return (
        <span
          className="inline-block h-3 w-3 rounded-full bg-orange-400 mr-2"
          aria-hidden
        />
      );
    return (
      <span
        className="inline-block h-3 w-3 rounded-full bg-gray-400 mr-2"
        aria-hidden
      />
    );
  };

  const handleDelete = (id: string) => {
    setData((prev) => prev.filter((item) => item._id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-[1200px] mx-auto bg-white shadow-sm rounded-lg overflow-hidden">
        {/* Header */}
        <div className="px-6 py-6 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">Cameras</h1>
              <p className="text-sm text-gray-500">Manage your cameras here.</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  className="pl-10 pr-4 py-2 border rounded-md bg-white text-sm w-64 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  placeholder="search"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setPage(1);
                  }}
                />
                <div className="absolute left-3 top-2.5 text-gray-400">
                  <IconSearch />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="px-6 py-4 border-b">
          <div className="flex items-center gap-3">
            <select
              value={locationFilter}
              onChange={(e) => {
                setLocationFilter(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 border rounded-md text-sm bg-white"
            >
              <option value="">All Locations</option>
              {locations.slice(1).map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 border rounded-md text-sm bg-white"
            >
              <option value="">All Status</option>
              {statuses.slice(1).map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <div className="flex-1" />
          </div>
        </div>

        {/* Table */}
        <div className="px-6 py-4">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-white">
                <tr>
                  <th className="px-4 py-3 text-left w-12">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="form-checkbox h-4 w-4 text-indigo-600"
                        onChange={toggleAll}
                        checked={
                          pageItems.every((p) => selected.has(p.id)) &&
                          pageItems.length > 0
                        }
                      />
                    </label>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
                    NAME
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
                    HEALTH
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
                    LOCATION
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
                    RECORDER
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
                    TASKS
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
                    STATUS
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500">
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {pageItems.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 align-top">
                      <input
                        type="checkbox"
                        checked={selected.has(row.id)}
                        onChange={() => toggleRow(row.id)}
                        className="form-checkbox h-4 w-4"
                      />
                    </td>
                    <td className="px-4 py-4 align-top">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0">
                          <div className="h-5 w-5   flex items-center justify-center  font-medium text-sm">
                            <CurrentStatus currentStatus={row.current_status} />
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-800">
                            {row.name}
                          </div>
                          <div className="text-xs text-gray-400">
                            {row.current_status}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 align-top text-sm text-gray-600">
                      <div className="flex space-x-2 items-center">
                        <CloudIcon />
                        <div className="text-sm">
                          <RingBadge text={row?.health?.cloud} />
                        </div>
                        <DeviceIcon />
                        <RingBadge text={row?.health?.device} />
                      </div>
                    </td>
                    <td className="px-4 py-4 align-top text-sm text-gray-700">
                      {row.location || "N/A"}
                    </td>
                    <td className="px-4 py-4 align-top text-sm text-gray-700">
                      {row.recorder || "N/A"}
                    </td>
                    <td className="px-4 py-4 align-top text-sm text-gray-700">
                      {row.tasks === null ? "N/A" : `${row.tasks} Tasks`}
                    </td>
                    <td className="px-4 py-4 align-top">
                      <StatusPill status={row.status} />
                    </td>
                    <td className="px-4 py-4 align-top text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          className="p-2 rounded-full hover:bg-gray-100"
                          onClick={() => handleDelete(row?._id)}
                        >
                          <IconDots />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {pageItems.length === 0 && (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-4 py-6 text-center text-sm text-gray-500"
                    >
                      No cameras found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer / Pagination */}
        <div className="px-6 py-4 border-t bg-white flex items-center justify-between">
          <div className="text-sm text-gray-600">{`Showing ${
            start + 1
          }-${Math.min(start + perPage, total)} of ${total}`}</div>

          <div className="flex items-center gap-2">
            <select
              value={perPage}
              onChange={(e) => {
                setPerPage(Number(e.target.value));
                setPage(1);
              }}
              className="px-2 py-1 border rounded"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>

            <div className="inline-flex items-center divide-x rounded-md overflow-hidden border">
              <button
                className="px-3 py-2 disabled:opacity-40"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <IconChevronLeft />
              </button>
              <div className="px-3 py-2 text-sm">{page}</div>
              <button
                className="px-3 py-2 disabled:opacity-40"
                disabled={page === pageCount}
                onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
              >
                <IconChevronRight />
              </button>
            </div>

            <div className="text-sm text-gray-500">Page</div>
          </div>
        </div>
      </div>
    </div>
  );
}
