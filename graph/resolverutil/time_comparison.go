// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package resolverutil

import (
	"time"
)

func GE(date1 time.Time, date2 time.Time) bool {
	return date1.After(date2) || date1.Equal(date2)
}

func LE(date1 time.Time, date2 time.Time) bool {
	return date1.Before(date2) || date1.Equal(date2)
}

func IsWorkday(date time.Time) bool {
	switch date.Weekday() {
	case time.Saturday:
		return false
	case time.Sunday:
		return false
	default:
		return true
	}
}

func IsWorkTime(date time.Time, startHour int, startMinute int, endHour int, endMinute int) bool {
	if !IsWorkday(date) {
		return false
	}

	h := date.Hour()
	m := date.Minute()
	return (h == startHour && m >= startMinute) ||
		(h > startHour && h < endHour) ||
		(h == endHour && m <= endMinute)
}

func NextWorkDay(date time.Time, startHour int, startMinute int, endHour int, endMinute int) time.Time {
	nextWorkDay := date.AddDate(0, 0, 1)
	for {
		if IsWorkday(nextWorkDay) {
			return nextWorkDay
		}
		nextWorkDay = nextWorkDay.AddDate(0, 0, 1)
	}
}
