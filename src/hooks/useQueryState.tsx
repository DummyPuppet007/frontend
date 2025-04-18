import React from "react";
//
// Custom hook to manage "from" and "to" query parameters
//
export function useQueryStates(
    defaults: { from: string; to: string },
    shallow: boolean
  ) {
    const [params, setParams] = React.useState(() => {
      if (typeof window !== "undefined") {
        const urlParams = new URLSearchParams(window.location.search);
        return {
          from: urlParams.get("from") ?? defaults.from,
          to: urlParams.get("to") ?? defaults.to,
        };
      }
      return defaults;
    });
  
    const setQueryStates = (newParams: { from: string; to: string }) => {
      setParams(newParams);
      if (typeof window !== "undefined") {
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set("from", newParams.from);
        urlParams.set("to", newParams.to);
        const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
        if (shallow) {
          window.history.replaceState(null, "", newUrl);
        } else {
          // Trigger a network request by reloading the page.
          window.location.href = newUrl;
        }
      }
    };
  
    return [params, setQueryStates] as const;
  }
  