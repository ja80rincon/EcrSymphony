// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package resolverutil

import (
	"context"
	"fmt"
	"reflect"
	"strconv"

	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/facebookincubator/symphony/pkg/ent/propertytype"
	"github.com/facebookincubator/symphony/pkg/ent/schema/enum"
	"github.com/pkg/errors"
)

type AddPropertyArgs struct {
	context.Context
	EntSetter  func(*ent.PropertyCreate)
	IsTemplate *bool
}

func NodePropertyValue(ctx context.Context, p *ent.Property, nodeType string) string {
	var id *int
	switch nodeType {
	case enum.NodeTypeLocation.String():
		if i, err := p.QueryLocationValue().OnlyID(ctx); err == nil {
			id = &i
		}
	case enum.NodeTypeEquipment.String():
		if i, err := p.QueryEquipmentValue().OnlyID(ctx); err == nil {
			id = &i
		}
	case enum.NodeTypeService.String():
		if i, err := p.QueryServiceValue().OnlyID(ctx); err == nil {
			id = &i
		}
	case enum.NodeTypeWorkOrder.String():
		if i, err := p.QueryWorkOrderValue().OnlyID(ctx); err == nil {
			id = &i
		}
	case enum.NodeTypeUser.String():
		if i, err := p.QueryUserValue().OnlyID(ctx); err == nil {
			id = &i
		}
	case enum.NodeTypeProject.String():
		if i, err := p.QueryProjectValue().OnlyID(ctx); err == nil {
			id = &i
		}
	default:
		return ""
	}
	if id == nil {
		return ""
	}
	return strconv.Itoa(*id)
}

func PropertyValue(ctx context.Context, typ propertytype.Type, nodeType string, v interface{}) (string, error) {
	switch v.(type) {
	case *ent.PropertyType, *ent.Property:
	default:
		return "", errors.Errorf("invalid type: %T", v)
	}
	vo := reflect.ValueOf(v).Elem()
	switch typ {
	case propertytype.TypeEmail, propertytype.TypeString, propertytype.TypeDate,
		propertytype.TypeEnum, propertytype.TypeDatetimeLocal:
		strValue := vo.FieldByName("StringVal")
		if strValue.IsNil() {
			return "", nil
		}
		return reflect.Indirect(strValue).String(), nil
	case propertytype.TypeInt:
		intValue := vo.FieldByName("IntVal")
		if intValue.IsNil() {
			return "", nil
		}
		return strconv.Itoa(int(reflect.Indirect(intValue).Int())), nil
	case propertytype.TypeFloat:
		floatValue := vo.FieldByName("FloatVal")
		if floatValue.IsNil() {
			return "", nil
		}
		return fmt.Sprintf("%.3f", reflect.Indirect(floatValue).Float()), nil
	case propertytype.TypeGpsLocation:
		latitudeValue := vo.FieldByName("LatitudeVal")
		longitudeValue := vo.FieldByName("LongitudeVal")
		if latitudeValue.IsNil() || longitudeValue.IsNil() {
			return "", nil
		}
		la, lo := reflect.Indirect(latitudeValue).Float(), reflect.Indirect(longitudeValue).Float()
		return fmt.Sprintf("%f", la) + ", " + fmt.Sprintf("%f", lo), nil
	case propertytype.TypeRange:
		rangeFromValue := vo.FieldByName("RangeFromVal")
		rangeToValue := vo.FieldByName("RangeToVal")
		if rangeFromValue.IsNil() || rangeToValue.IsNil() {
			return "", nil
		}
		rf, rt := reflect.Indirect(rangeFromValue).Float(), reflect.Indirect(rangeToValue).Float()
		return fmt.Sprintf("%.3f", rf) + " - " + fmt.Sprintf("%.3f", rt), nil
	case propertytype.TypeBool:
		boolValue := vo.FieldByName("BoolVal")
		if boolValue.IsNil() {
			return "", nil
		}
		return strconv.FormatBool(reflect.Indirect(boolValue).Bool()), nil
	case propertytype.TypeNode:
		p, ok := v.(*ent.Property)
		if !ok {
			return "", nil
		}
		return NodePropertyValue(ctx, p, nodeType), nil
	default:
		return "", errors.Errorf("type not supported %s", typ)
	}
}
