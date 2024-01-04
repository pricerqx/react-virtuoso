import { TableVirtuosoProps } from './TableVirtuoso'

export interface TableVirtuosoGroupsProps<D, C> extends TableVirtuosoProps<D, C> {
  /**
   * Specifies the amount of items in each group (and, actually, how many groups are there).
   * For example, passing [20, 30] will display 2 groups with 20 and 30 items each.
   */
  groupCounts?: number[]

  fixedHeaderHeight?: number
}
