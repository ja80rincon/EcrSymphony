#!/usr/bin/env python3

from zipfile import ZIP_DEFLATED, ZipFile
from graphql import build_ast_schema
from graphql.language.parser import parse
import os
import glob


def extract_zip(input_zip_filepath):
    with ZipFile(input_zip_filepath) as input_zip:
        return {name: input_zip.read(name) for name in input_zip.namelist()}


def archive_zip(output_zip_filepath, zip_contents):
    with ZipFile(output_zip_filepath, "w", ZIP_DEFLATED) as output_zip:
        for name, content in zip_contents.items():
            output_zip.writestr(name, content)


def compile_schema_library(schema_library: str):
    full_schema = ""
    # use the following line to use .graphqls files as well
    # os.path.join(schema_library, "**/*.graphql*"), recursive=True
    schema_filepaths = glob.glob(
        os.path.join(schema_library, "**/*.graphql"), recursive=True
    )
    for schema_filepath in schema_filepaths:
        with open(schema_filepath) as schema_file:
            full_schema = full_schema + schema_file.read()
    return build_ast_schema(parse(full_schema))
