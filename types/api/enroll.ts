import type { Enrollment } from "@/types/database";

export type EnrollSuccessResponse = {
  success: true;
  enrollment: Enrollment;
  message: string;
};

export type EnrollAlreadyResponse = {
  message: string;
  enrolled: true;
};

export type UnenrollResponse = {
  success: true;
  message: string;
};
