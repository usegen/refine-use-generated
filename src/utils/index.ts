
const itemWithSameIdExists = (itemsList: any[], item: any) => {
  return itemsList.map((item: any) => item?.id).filter(i => !!i)
    .indexOf(item?.id) !== -1
}

export const createDeleteUpdateFields = (currentData: any, initialData: any) => {
  console.log('currentData...', currentData)
  console.log('initialData...', initialData)
  if (Array.isArray(currentData)) {
    const nestedResourcestoBeCreated = currentData.filter((item: any) => !item?.id);
    const nestedResourcesToBeUpdated = currentData.filter((item: any) => !!item?.id);
    const nestedResourcestoBeDeleted = initialData.filter((item: any) => !itemWithSameIdExists(currentData, item))
    return {
      create: nestedResourcestoBeCreated,
      update: nestedResourcesToBeUpdated,
      delete: nestedResourcestoBeDeleted,
    }
  } 
  if (!isNaN(Number(currentData))) {
    return {connect:{id:Number(currentData)}}
  }
  return {}

}

export const updateNestedInput = (nestedFields: any, initialVariables: any={}) => {

  return Object.entries(nestedFields).reduce((accum, [fieldName, data]) => {
    return {
      ...accum,
      [fieldName]: {
        ...createDeleteUpdateFields(data,  {})
      }
    };
  }, {});
};
export const includeJustPropsFromObj = (obj: any, propList: any) => {
  return Object.entries(obj).filter(([fieldName, _]) => {
    return propList.indexOf(fieldName) !== -1
  })
    .reduce((accum, [fieldName, data]) => {
      return {
        ...accum,
        [fieldName]: data
      }
    }, {})
}
export const excludePropsFomObj = (obj: any, propList: any) => {
  return Object.entries(obj).filter(([fieldName, _]) => {
    return propList.indexOf(fieldName) === -1
  })
    .reduce((accum, [fieldName, data]) => {
      return {
        ...accum,
        [fieldName]: data
      }
    }, {})
}
export const createNestedInput = (nestedFields: any) => {

  return Object.entries(nestedFields).reduce((accum, [fieldName, data]) => {
    return {
      ...accum,
      [fieldName]: {
        create: data
      }
    }
  }, {})
}

export const generateSort = (sorters: any = []) => {

  const sortProp = sorters.map((field: any) => {
    if (!!field?.field && field?.order) {
      return {
        [field?.field]: field?.order
      }
    }
    return null
  }).filter((r: any) => !!r)
  return sortProp
}

export const generateWherePropFromFilters = (filters: any = [], nestedFieldsNames: any[] = [], nestedListFieldsNames: any[] = []) => {
  console.log('props from filters....', filters)
  const whereProp = filters.reduce((accum: any, filter: any) => {
    if (
      filter.operator !== "or" &&
      filter.operator !== "and" &&
      "field" in filter
    ) {
      const { field, operator, value } = filter;
      console.log(operator, value, 'nestedFieldsNames', nestedFieldsNames)
      if (operator === "in" && nestedListFieldsNames.indexOf(field) !== -1) {


        return {
          ...accum,
          [field]: { some: { id: { in: value.map((val: string) => Number(val)) } } }
        }
      }
      // todo cehck for non M2m then no some just in
      if (operator === "in" && nestedFieldsNames.indexOf(field) !== -1) {


        return {
          ...accum,
          [field]: { is: { id: { in: value.map((val: string) => Number(val)) } } }
        }
      }
      if (operator === "eq" && nestedListFieldsNames.indexOf(field) !== -1) {

        return {
          ...accum,
          [field]: { some: { id: { equals: Number(value) } } }
        }
      }
      if (operator === "eq" && nestedFieldsNames.indexOf(field) !== -1) {

        return {
          ...accum,
          [field]: { is: { id: { equals: Number(value) } } }
        }
      }

      if (operator === "eq" && nestedFieldsNames.indexOf(field) === -1 && nestedListFieldsNames.indexOf(field) !== -1) {
        return {
          ...accum,
          [field]: { equals: value }
        }
      }
      if (["lt", "gt", "lte", "gte"].indexOf(operator) !== -1) {
        return {
          ...accum,
          [field]: { [operator]: value }
        }
      }


    }

    return {
      ...accum
    }
  }, {})

  return whereProp
}