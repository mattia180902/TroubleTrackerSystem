import { Component, OnInit } from '@angular/core';
import { CategoryService } from '@core/services/category.service';
import { Category } from '@core/models';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];
  loading = true;
  error: string | null = null;
  
  // Form states
  categoryForm: FormGroup;
  isEditMode = false;
  selectedCategory: Category | null = null;
  submitting = false;
  formError: string | null = null;
  
  // Delete confirmation
  showConfirmDialog = false;
  categoryToDelete: Category | null = null;
  
  constructor(
    private categoryService: CategoryService,
    private fb: FormBuilder
  ) {
    this.categoryForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      description: ['', Validators.maxLength(200)]
    });
  }

  loadCategories(): void {
    this.loading = true;
    this.error = null;
    
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading categories', err);
        this.error = 'Failed to load categories. Please try again.';
        this.loading = false;
      }
    });
  }

  editCategory(category: Category): void {
    this.isEditMode = true;
    this.selectedCategory = category;
    
    this.categoryForm.patchValue({
      name: category.name,
      description: category.description || ''
    });
  }

  cancelEdit(): void {
    this.isEditMode = false;
    this.selectedCategory = null;
    this.categoryForm.reset();
    this.formError = null;
  }

  confirmDelete(category: Category): void {
    this.categoryToDelete = category;
    this.showConfirmDialog = true;
  }
  
  cancelDelete(): void {
    this.categoryToDelete = null;
    this.showConfirmDialog = false;
  }
  
  deleteCategory(): void {
    if (!this.categoryToDelete) return;
    
    const categoryId = this.categoryToDelete.id;
    
    this.categoryService.deleteCategory(categoryId).subscribe({
      next: () => {
        this.showConfirmDialog = false;
        this.categoryToDelete = null;
        this.loadCategories();
      },
      error: (err) => {
        console.error('Error deleting category', err);
        this.error = 'Failed to delete category. It might be in use by existing tickets.';
        this.showConfirmDialog = false;
        this.categoryToDelete = null;
      }
    });
  }

  onSubmit(): void {
    if (this.categoryForm.invalid) return;
    
    this.submitting = true;
    this.formError = null;
    
    const formData = this.categoryForm.value;
    
    // If editing an existing category
    if (this.isEditMode && this.selectedCategory) {
      this.categoryService.updateCategory(this.selectedCategory.id, formData).subscribe({
        next: () => {
          this.submitting = false;
          this.isEditMode = false;
          this.selectedCategory = null;
          this.categoryForm.reset();
          this.loadCategories();
        },
        error: (err) => {
          console.error('Error updating category', err);
          this.formError = 'Failed to update category.';
          this.submitting = false;
        }
      });
    } 
    // If creating a new category
    else {
      this.categoryService.createCategory(formData).subscribe({
        next: () => {
          this.submitting = false;
          this.categoryForm.reset();
          this.loadCategories();
        },
        error: (err) => {
          console.error('Error creating category', err);
          this.formError = 'Failed to create category.';
          this.submitting = false;
        }
      });
    }
  }
  
  // Helper methods for form validation
  get nameControl() { return this.categoryForm.get('name'); }
  get descriptionControl() { return this.categoryForm.get('description'); }
}