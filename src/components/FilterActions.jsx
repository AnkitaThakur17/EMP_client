const FilterActions = ({
  onApply,
  onReset,
  isApplyDisabled = false,
  isResetDisabled = false,
  loading = false,
}) => {
  return (
    <div className="flex justify-end mb-4 gap-4 mt-4">
      <button
        type="button"
        onClick={onApply}
        disabled={isApplyDisabled || loading}
        className={`px-4 py-2 rounded-md text-white transition
          ${isApplyDisabled || loading
            ? "bg-indigo-300 cursor-not-allowed"
            : "bg-indigo-600 hover:bg-indigo-700"
          }`}
      >
        Apply
      </button>

      <button
        type="button"
        onClick={onReset}
        disabled={isResetDisabled || loading}
        className={`px-4 py-2 rounded-md transition
          ${isResetDisabled || loading
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
      >
        Reset
      </button>
    </div>
  );
};

export default FilterActions;
