"use client";

import { Category } from "@prisma/client";
import {
    FcAddressBook,
  FcEngineering,
  FcFilmReel,
  FcMultipleDevices,
  FcMusic,
  FcOldTimeCamera,
  
  FcSportsMode,
  FcSwitchCamera
} from "react-icons/fc";
import { IconType } from "react-icons";
import { CategoryItem } from "./category-item";

interface CategoriesProps {
  items: Category[];
}

const iconMap: Record<Category["name"], IconType> = {
  "Computer Science": FcMultipleDevices,
  "Music": FcMusic,
  "Filming": FcFilmReel,
  "Cooking": FcAddressBook,
  "Fitness": FcSportsMode,
  "Engineering": FcEngineering,
  "Gaming": FcSwitchCamera,
  "Other": FcOldTimeCamera
};

export const Categories = ({
  items,
}: CategoriesProps) => {
  return (
    <div className="flex items-center gap-x-2 overflow-x-auto  pb-2">
      {items.map((item) => (
        <CategoryItem
          key={item.id}
          label={item.name}
          icon={iconMap[item.name]}
          value={item.id}
        />
      ))}
    </div>
  )
}