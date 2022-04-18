/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 * @flow strict-local
 * @format
 */

import type {SearchContextValueType} from './SearchContext';

import * as React from 'react';
import emptyFunction from '@fbcnms/util/emptyFunction';
import {NO_SEARCH_VALUE} from './SearchContext';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {debounce} from 'lodash';

function getEmptyResults<T>(): Array<T> {
  return ([]: Array<T>);
}

function useSearchWithFilterManagerBuilder<T>(
  searchCallback: string => Promise<Array<T>>,
  filters,
): SearchContextValueType<T> {
  const EMPTY_SEARCH_RESULTS = useMemo(() => getEmptyResults<T>(), []);
  const [lastSearchedTerm, setLastSearchedTerm] = useState(NO_SEARCH_VALUE);
  const [searchTerm, setSearchTerm] = useState(NO_SEARCH_VALUE);
  const [results, setResults] = useState<Array<T>>(EMPTY_SEARCH_RESULTS);
  const [isSearchInProgress, setIsSearchInProgress] = useState(false);
  const [isEmptySearchTerm, setIsEmptySearchTerm] = useState(true);

  const runSearch = useCallback(
    debounce(currentSearchTerm => {
      setIsSearchInProgress(true);
      searchCallback(currentSearchTerm, filters)
        .then(setResults)
        .finally(() => setIsSearchInProgress(false));
    }, 200),
    filters,
  );

  useEffect(() => {
    const actualSearchTerm = searchTerm.trim();
    if (actualSearchTerm == NO_SEARCH_VALUE) {
      setIsSearchInProgress(false);
      setResults(EMPTY_SEARCH_RESULTS);
      setLastSearchedTerm(NO_SEARCH_VALUE);
    } else if (actualSearchTerm == lastSearchedTerm) {
      setIsSearchInProgress(false);
    } else {
      runSearch(actualSearchTerm);
      setIsSearchInProgress(true);
      setLastSearchedTerm(actualSearchTerm);
    }
    setIsEmptySearchTerm(actualSearchTerm == NO_SEARCH_VALUE);
  }, [EMPTY_SEARCH_RESULTS, lastSearchedTerm, runSearch, searchTerm]);

  const clearSearch = useCallback(() => setSearchTerm(NO_SEARCH_VALUE), []);

  return {
    searchTerm,
    results,
    setSearchTerm,
    clearSearch,
    isSearchInProgress,
    isEmptySearchTerm,
  };
}

type ContextProviderProps = $ReadOnly<{|
  children: React.Node,
|}>;

/*
  The Flow issue here is that the function doesn't
  cascade parameterized generics.
  In https://flow.org/en/docs/types/generics/#toc-parameterized-generics:
  '...Functions and function types do not have parameterized generics.'
*/
// eslint-disable-next-line
// $FlowFixMe
export default function createSearchWithFiltersContext<T: Object>( // eslint-disable-line
  searchCallback: string => Promise<Array<T>>,
) {
  const SearchContext = createContext<SearchContextValueType<T>>({
    searchTerm: NO_SEARCH_VALUE,
    results: getEmptyResults<T>(),
    setSearchTerm: emptyFunction,
    clearSearch: emptyFunction,
    isSearchInProgress: false,
    isEmptySearchTerm: false,
  });

  const useSearchWithFilters = filters =>
    useSearchWithFilterManagerBuilder<T>(searchCallback, filters);

  const SearchContextProvider = (props: ContextProviderProps) => {
    const {children} = props;

    return (
      <SearchContext.Provider value={useSearchWithFilters()}>
        {children}
      </SearchContext.Provider>
    );
  };

  const useSearchContext = () => {
    return useContext(SearchContext);
  };

  return {
    SearchContext,
    SearchContextProvider,
    useSearchContext,
    useSearchWithFilters,
  };
}
